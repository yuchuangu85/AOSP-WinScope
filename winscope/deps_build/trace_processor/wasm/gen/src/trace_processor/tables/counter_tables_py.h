#ifndef SRC_TRACE_PROCESSOR_TABLES_COUNTER_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_COUNTER_TABLES_PY_H_

#include <array>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <optional>
#include <tuple>
#include <type_traits>
#include <utility>
#include <variant>
#include <vector>

#include "perfetto/base/compiler.h"
#include "perfetto/base/logging.h"
#include "perfetto/public/compiler.h"
#include "perfetto/trace_processor/basic_types.h"
#include "perfetto/trace_processor/ref_counted.h"
#include "src/trace_processor/dataframe/dataframe.h"
#include "src/trace_processor/dataframe/specs.h"
#include "src/trace_processor/dataframe/typed_cursor.h"
#include "src/trace_processor/tables/macros_internal.h"

#include "src/trace_processor/tables/track_tables_py.h"

namespace perfetto::trace_processor::tables {

class CounterTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","track_id","value","arg_set_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

  struct Id : BaseId {
    Id() = default;
    explicit constexpr Id(uint32_t _value) : BaseId(_value) {}

    bool operator==(const Id& other) const {
      return value == other.value;
    }
  };
  struct RowReference;
  struct ConstRowReference;
  struct RowNumber {
   public:
    explicit constexpr RowNumber(uint32_t value) : value_(value) {}
    uint32_t row_number() const { return value_; }

    RowReference ToRowReference(CounterTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const CounterTable& table) const {
      return ConstRowReference(&table, value_);
    }

    bool operator==(const RowNumber& other) const {
      return value_ == other.value_;
    }
    bool operator<(const RowNumber& other) const {
      return value_ < other.value_;
    }
   private:
    uint32_t value_;
  };
  struct ColumnIndex {
    static constexpr uint32_t id = 0;
    static constexpr uint32_t ts = 1;
    static constexpr uint32_t track_id = 2;
    static constexpr uint32_t value = 3;
    static constexpr uint32_t arg_set_id = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(CounterTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    CounterTable::Id id() const {
        
        return CounterTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          TrackTable::Id track_id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_id>(kSpec, row_)};
      }
        double value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::value>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    void set_track_id(TrackTable::Id res) {
        
        table_->dataframe_.SetCellUnchecked<ColumnIndex::track_id>(kSpec, row_, res.value);
      }
        void set_value(double res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::value>(kSpec, row_, res);
    }
        void set_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    CounterTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const CounterTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    CounterTable::Id id() const {
        
        return CounterTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          TrackTable::Id track_id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_id>(kSpec, row_)};
      }
        double value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::value>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const CounterTable* table_;
    uint32_t row_;
  };
  class ConstCursor {
   public:
    explicit ConstCursor(const dataframe::Dataframe& df,
                         std::vector<dataframe::FilterSpec> filters,
                         std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }
    CounterTable::Id id() const {
        
        return CounterTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      TrackTable::Id track_id() const {
        
        return TrackTable::Id{cursor_.GetCellUnchecked<ColumnIndex::track_id>(kSpec)};
      }
    double value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::value>(kSpec);
    }
    std::optional<uint32_t> arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }

   private:
    const dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Cursor {
   public:
    explicit Cursor(dataframe::Dataframe& df,
                    std::vector<dataframe::FilterSpec> filters,
                    std::vector<dataframe::SortSpec> sorts)
      : dataframe_(&df), cursor_(&df, std::move(filters), std::move(sorts)) {
      base::ignore_result(dataframe_);
    }

    PERFETTO_ALWAYS_INLINE void Execute() { cursor_.ExecuteUnchecked(); }
    PERFETTO_ALWAYS_INLINE bool Eof() const { return cursor_.Eof(); }
    PERFETTO_ALWAYS_INLINE void Next() { cursor_.Next(); }
    template <typename C>
    PERFETTO_ALWAYS_INLINE void SetFilterValueUnchecked(uint32_t index, C value) {
      cursor_.SetFilterValueUnchecked(index, std::move(value));
    }
    RowNumber ToRowNumber() const {
      return RowNumber{cursor_.RowIndex()};
    }
    void Reset() { cursor_.Reset(); }

    CounterTable::Id id() const {
        
        return CounterTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      TrackTable::Id track_id() const {
        
        return TrackTable::Id{cursor_.GetCellUnchecked<ColumnIndex::track_id>(kSpec)};
      }
    double value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::value>(kSpec);
    }
    std::optional<uint32_t> arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    void set_track_id(TrackTable::Id res) {
        
        cursor_.SetCellUnchecked<ColumnIndex::track_id>(kSpec, res.value);
      }
    void set_value(double res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::value>(kSpec, res);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(CounterTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      Iterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      RowReference ToRowReference() const {
        return RowReference(table_, row_);
      }
      CounterTable::Id id() const {
        
        return CounterTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          TrackTable::Id track_id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_id>(kSpec, row_)};
      }
        double value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::value>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
      void set_track_id(TrackTable::Id res) {
        
        table_->dataframe_.SetCellUnchecked<ColumnIndex::track_id>(kSpec, row_, res.value);
      }
        void set_value(double res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::value>(kSpec, row_, res);
    }
        void set_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }

    private:
      CounterTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const CounterTable* table) : table_(table) {
        base::ignore_result(table_);
      }
      explicit operator bool() const { return row_ < table_->row_count(); }
      ConstIterator& operator++() {
        ++row_;
        return *this;
      }
      RowNumber row_number() const {
        return RowNumber{row_};
      }
      ConstRowReference ToRowReference() const {
        return ConstRowReference(table_, row_);
      }
      CounterTable::Id id() const {
        
        return CounterTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          TrackTable::Id track_id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_id>(kSpec, row_)};
      }
        double value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::value>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }

    private:
      const CounterTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, TrackTable::Id _track_id = {}, double _value = {}, std::optional<uint32_t> _arg_set_id = {}) : ts(std::move(_ts)), track_id(std::move(_track_id)), value(std::move(_value)), arg_set_id(std::move(_arg_set_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, track_id, value, arg_set_id) ==
             std::tie(other.ts, other.track_id, other.value, other.arg_set_id);
    }

        int64_t ts;
    TrackTable::Id track_id;
    double value;
    std::optional<uint32_t> arg_set_id;
  };

  explicit CounterTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.track_id.value, row.value, row.arg_set_id);
    return IdAndRow{Id{row_count}, RowNumber{row_count}, row_count, RowReference(this, row_count)};
  }

  uint32_t row_count() const {
    return dataframe_.row_count();
  }

  std::optional<ConstRowReference> FindById(Id id) const {
    return ConstRowReference(this, id.value);
  }
  ConstRowReference operator[](uint32_t row) const {
    return ConstRowReference(this, row);
  }

  std::optional<RowReference> FindById(Id id) {
    return RowReference(this, id.value);
  }
  RowReference operator[](uint32_t row) {
    return RowReference(this, row);
  }

  ConstCursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) const {
    return ConstCursor(dataframe_, std::move(filters), std::move(sorts));
  }
  Cursor CreateCursor(
      std::vector<dataframe::FilterSpec> filters = {},
      std::vector<dataframe::SortSpec> sorts = {}) {
    return Cursor(dataframe_, std::move(filters), std::move(sorts));
  }

  Iterator IterateRows() { return Iterator(this); }
  ConstIterator IterateRows() const { return ConstIterator(this); }

  void Finalize() { dataframe_.Finalize(); }

  void Clear() { dataframe_.Clear(); }

  static const char* Name() {
    return "__intrinsic_counter";
  }

  dataframe::Dataframe& dataframe() {
    return dataframe_;
  }
  const dataframe::Dataframe& dataframe() const {
    return dataframe_;
  }

 private:
  dataframe::Dataframe dataframe_;
};

}  // namespace perfetto

#endif  // SRC_TRACE_PROCESSOR_TABLES_COUNTER_TABLES_PY_H_
