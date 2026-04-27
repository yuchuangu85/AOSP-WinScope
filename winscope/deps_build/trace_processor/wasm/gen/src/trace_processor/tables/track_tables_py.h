#ifndef SRC_TRACE_PROCESSOR_TABLES_TRACK_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_TRACK_TABLES_PY_H_

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

#include "src/trace_processor/tables/metadata_tables_py.h"

namespace perfetto::trace_processor::tables {

class TrackTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","name","parent_id","source_arg_set_id","machine_id","type","dimension_arg_set_id","track_group_id","event_type","counter_unit","utid","upid"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
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

    RowReference ToRowReference(TrackTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const TrackTable& table) const {
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
    static constexpr uint32_t name = 1;
    static constexpr uint32_t parent_id = 2;
    static constexpr uint32_t source_arg_set_id = 3;
    static constexpr uint32_t machine_id = 4;
    static constexpr uint32_t type = 5;
    static constexpr uint32_t dimension_arg_set_id = 6;
    static constexpr uint32_t track_group_id = 7;
    static constexpr uint32_t event_type = 8;
    static constexpr uint32_t counter_unit = 9;
    static constexpr uint32_t utid = 10;
    static constexpr uint32_t upid = 11;
  };
  struct RowReference {
   public:
    explicit RowReference(TrackTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    TrackTable::Id id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<TrackTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(TrackTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> source_arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec, row_);
    }
          StringPool::Id type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> dimension_arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> track_group_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_group_id>(kSpec, row_);
    }
          std::optional<uint32_t> utid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
          std::optional<uint32_t> upid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
    void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
          void set_parent_id(std::optional<TrackTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_, res_value);
      }
        void set_source_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec, row_, res);
    }
        void set_dimension_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec, row_, res);
    }
        void set_track_group_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::track_group_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    TrackTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const TrackTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    TrackTable::Id id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<TrackTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(TrackTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> source_arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec, row_);
    }
          StringPool::Id type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> dimension_arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> track_group_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_group_id>(kSpec, row_);
    }
          std::optional<uint32_t> utid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
          std::optional<uint32_t> upid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const TrackTable* table_;
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
    TrackTable::Id id() const {
        
        return TrackTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      std::optional<TrackTable::Id> parent_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_id>(kSpec);
        return res ? std::make_optional(TrackTable::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> source_arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec);
    }
      StringPool::Id type() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::type>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<uint32_t> dimension_arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec);
    }
    std::optional<uint32_t> track_group_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::track_group_id>(kSpec);
    }
      std::optional<uint32_t> utid() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
      std::optional<uint32_t> upid() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
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

    TrackTable::Id id() const {
        
        return TrackTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      std::optional<TrackTable::Id> parent_id() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_id>(kSpec);
        return res ? std::make_optional(TrackTable::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> source_arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec);
    }
      StringPool::Id type() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::type>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<uint32_t> dimension_arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec);
    }
    std::optional<uint32_t> track_group_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::track_group_id>(kSpec);
    }
      std::optional<uint32_t> utid() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
      std::optional<uint32_t> upid() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
    void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::name>(kSpec, res_value);
    }
      void set_parent_id(std::optional<TrackTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, res_value);
      }
    void set_source_arg_set_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec, res);
    }
    void set_dimension_arg_set_id(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec, res);
    }
    void set_track_group_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::track_group_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(TrackTable* table) : table_(table) {
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
      TrackTable::Id id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<TrackTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(TrackTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> source_arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec, row_);
    }
          StringPool::Id type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> dimension_arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> track_group_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_group_id>(kSpec, row_);
    }
          std::optional<uint32_t> utid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
          std::optional<uint32_t> upid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
      void set_name(StringPool::Id res) {
        
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
          void set_parent_id(std::optional<TrackTable::Id> res) {
        
        auto res_value = res ? std::make_optional(res->value) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_, res_value);
      }
        void set_source_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec, row_, res);
    }
        void set_dimension_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec, row_, res);
    }
        void set_track_group_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::track_group_id>(kSpec, row_, res);
    }

    private:
      TrackTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const TrackTable* table) : table_(table) {
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
      TrackTable::Id id() const {
        
        return TrackTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          std::optional<TrackTable::Id> parent_id() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_id>(kSpec, row_);
        return res ? std::make_optional(TrackTable::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> source_arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::source_arg_set_id>(kSpec, row_);
    }
          StringPool::Id type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> dimension_arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::dimension_arg_set_id>(kSpec, row_);
    }
        std::optional<uint32_t> track_group_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::track_group_id>(kSpec, row_);
    }
          std::optional<uint32_t> utid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
          std::optional<uint32_t> upid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }

    private:
      const TrackTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _name = {}, std::optional<TrackTable::Id> _parent_id = {}, std::optional<uint32_t> _source_arg_set_id = {}, std::optional<MachineTable::Id> _machine_id = {}, StringPool::Id _type = {}, std::optional<uint32_t> _dimension_arg_set_id = {}, std::optional<uint32_t> _track_group_id = {}, StringPool::Id _event_type = {}, std::optional<StringPool::Id> _counter_unit = {}, std::optional<uint32_t> _utid = {}, std::optional<uint32_t> _upid = {}) : name(std::move(_name)), parent_id(std::move(_parent_id)), source_arg_set_id(std::move(_source_arg_set_id)), machine_id(std::move(_machine_id)), type(std::move(_type)), dimension_arg_set_id(std::move(_dimension_arg_set_id)), track_group_id(std::move(_track_group_id)), event_type(std::move(_event_type)), counter_unit(std::move(_counter_unit)), utid(std::move(_utid)), upid(std::move(_upid)) {}

    bool operator==(const Row& other) const {
      return std::tie(name, parent_id, source_arg_set_id, machine_id, type, dimension_arg_set_id, track_group_id, event_type, counter_unit, utid, upid) ==
             std::tie(other.name, other.parent_id, other.source_arg_set_id, other.machine_id, other.type, other.dimension_arg_set_id, other.track_group_id, other.event_type, other.counter_unit, other.utid, other.upid);
    }

        StringPool::Id name;
    std::optional<TrackTable::Id> parent_id;
    std::optional<uint32_t> source_arg_set_id;
    std::optional<MachineTable::Id> machine_id;
    StringPool::Id type;
    std::optional<uint32_t> dimension_arg_set_id;
    std::optional<uint32_t> track_group_id;
    StringPool::Id event_type;
    std::optional<StringPool::Id> counter_unit;
    std::optional<uint32_t> utid;
    std::optional<uint32_t> upid;
  };

  explicit TrackTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.parent_id ? std::make_optional(row.parent_id->value) : std::nullopt, row.source_arg_set_id, row.machine_id ? std::make_optional(row.machine_id->value) : std::nullopt, row.type != StringPool::Id::Null() ? std::make_optional(row.type) : std::nullopt, row.dimension_arg_set_id, row.track_group_id, row.event_type != StringPool::Id::Null() ? std::make_optional(row.event_type) : std::nullopt, row.counter_unit && row.counter_unit != StringPool::Id::Null() ? std::make_optional(*row.counter_unit) : std::nullopt, row.utid, row.upid);
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
    return "__intrinsic_track";
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

#endif  // SRC_TRACE_PROCESSOR_TABLES_TRACK_TABLES_PY_H_
