#ifndef SRC_TRACE_PROCESSOR_TABLES_METADATA_TABLES_PY_H_
#define SRC_TRACE_PROCESSOR_TABLES_METADATA_TABLES_PY_H_

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



namespace perfetto::trace_processor::tables {

class MachineTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","raw_id","sysname","release","version","arch","num_cpus","android_build_fingerprint","android_device_manufacturer","android_sdk_version"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(MachineTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const MachineTable& table) const {
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
    static constexpr uint32_t raw_id = 1;
    static constexpr uint32_t sysname = 2;
    static constexpr uint32_t release = 3;
    static constexpr uint32_t version = 4;
    static constexpr uint32_t arch = 5;
    static constexpr uint32_t num_cpus = 6;
    static constexpr uint32_t android_build_fingerprint = 7;
    static constexpr uint32_t android_device_manufacturer = 8;
    static constexpr uint32_t android_sdk_version = 9;
  };
  struct RowReference {
   public:
    explicit RowReference(MachineTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    MachineTable::Id id() const {
        
        return MachineTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> sysname() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::sysname>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> release() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::release>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> version() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::version>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> arch() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::arch>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> num_cpus() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::num_cpus>(kSpec, row_);
    }
          std::optional<StringPool::Id> android_build_fingerprint() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> android_device_manufacturer() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> android_sdk_version() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec, row_);
    }
    void set_sysname(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::sysname>(kSpec, row_, res_value);
    }
          void set_release(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::release>(kSpec, row_, res_value);
    }
          void set_version(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::version>(kSpec, row_, res_value);
    }
          void set_arch(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::arch>(kSpec, row_, res_value);
    }
        void set_num_cpus(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::num_cpus>(kSpec, row_, res);
    }
          void set_android_build_fingerprint(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec, row_, res_value);
    }
          void set_android_device_manufacturer(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec, row_, res_value);
    }
        void set_android_sdk_version(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    MachineTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const MachineTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    MachineTable::Id id() const {
        
        return MachineTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> sysname() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::sysname>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> release() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::release>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> version() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::version>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> arch() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::arch>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> num_cpus() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::num_cpus>(kSpec, row_);
    }
          std::optional<StringPool::Id> android_build_fingerprint() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> android_device_manufacturer() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> android_sdk_version() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const MachineTable* table_;
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
    MachineTable::Id id() const {
        
        return MachineTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      std::optional<StringPool::Id> sysname() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::sysname>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> release() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::release>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> version() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::version>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> arch() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::arch>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> num_cpus() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::num_cpus>(kSpec);
    }
      std::optional<StringPool::Id> android_build_fingerprint() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> android_device_manufacturer() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<int64_t> android_sdk_version() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec);
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

    MachineTable::Id id() const {
        
        return MachineTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      std::optional<StringPool::Id> sysname() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::sysname>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> release() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::release>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> version() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::version>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> arch() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::arch>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> num_cpus() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::num_cpus>(kSpec);
    }
      std::optional<StringPool::Id> android_build_fingerprint() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      std::optional<StringPool::Id> android_device_manufacturer() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<int64_t> android_sdk_version() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec);
    }
    void set_sysname(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::sysname>(kSpec, res_value);
    }
      void set_release(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::release>(kSpec, res_value);
    }
      void set_version(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::version>(kSpec, res_value);
    }
      void set_arch(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::arch>(kSpec, res_value);
    }
    void set_num_cpus(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::num_cpus>(kSpec, res);
    }
      void set_android_build_fingerprint(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec, res_value);
    }
      void set_android_device_manufacturer(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec, res_value);
    }
    void set_android_sdk_version(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(MachineTable* table) : table_(table) {
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
      MachineTable::Id id() const {
        
        return MachineTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> sysname() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::sysname>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> release() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::release>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> version() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::version>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> arch() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::arch>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> num_cpus() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::num_cpus>(kSpec, row_);
    }
          std::optional<StringPool::Id> android_build_fingerprint() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> android_device_manufacturer() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> android_sdk_version() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec, row_);
    }
      void set_sysname(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::sysname>(kSpec, row_, res_value);
    }
          void set_release(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::release>(kSpec, row_, res_value);
    }
          void set_version(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::version>(kSpec, row_, res_value);
    }
          void set_arch(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::arch>(kSpec, row_, res_value);
    }
        void set_num_cpus(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::num_cpus>(kSpec, row_, res);
    }
          void set_android_build_fingerprint(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec, row_, res_value);
    }
          void set_android_device_manufacturer(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec, row_, res_value);
    }
        void set_android_sdk_version(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec, row_, res);
    }

    private:
      MachineTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const MachineTable* table) : table_(table) {
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
      MachineTable::Id id() const {
        
        return MachineTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          std::optional<StringPool::Id> sysname() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::sysname>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> release() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::release>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> version() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::version>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> arch() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::arch>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> num_cpus() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::num_cpus>(kSpec, row_);
    }
          std::optional<StringPool::Id> android_build_fingerprint() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_build_fingerprint>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
          std::optional<StringPool::Id> android_device_manufacturer() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_device_manufacturer>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> android_sdk_version() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_sdk_version>(kSpec, row_);
    }

    private:
      const MachineTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _raw_id = {}, std::optional<StringPool::Id> _sysname = {}, std::optional<StringPool::Id> _release = {}, std::optional<StringPool::Id> _version = {}, std::optional<StringPool::Id> _arch = {}, std::optional<uint32_t> _num_cpus = {}, std::optional<StringPool::Id> _android_build_fingerprint = {}, std::optional<StringPool::Id> _android_device_manufacturer = {}, std::optional<int64_t> _android_sdk_version = {}) : raw_id(std::move(_raw_id)), sysname(std::move(_sysname)), release(std::move(_release)), version(std::move(_version)), arch(std::move(_arch)), num_cpus(std::move(_num_cpus)), android_build_fingerprint(std::move(_android_build_fingerprint)), android_device_manufacturer(std::move(_android_device_manufacturer)), android_sdk_version(std::move(_android_sdk_version)) {}

    bool operator==(const Row& other) const {
      return std::tie(raw_id, sysname, release, version, arch, num_cpus, android_build_fingerprint, android_device_manufacturer, android_sdk_version) ==
             std::tie(other.raw_id, other.sysname, other.release, other.version, other.arch, other.num_cpus, other.android_build_fingerprint, other.android_device_manufacturer, other.android_sdk_version);
    }

        uint32_t raw_id;
    std::optional<StringPool::Id> sysname;
    std::optional<StringPool::Id> release;
    std::optional<StringPool::Id> version;
    std::optional<StringPool::Id> arch;
    std::optional<uint32_t> num_cpus;
    std::optional<StringPool::Id> android_build_fingerprint;
    std::optional<StringPool::Id> android_device_manufacturer;
    std::optional<int64_t> android_sdk_version;
  };

  explicit MachineTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.raw_id, row.sysname && row.sysname != StringPool::Id::Null() ? std::make_optional(*row.sysname) : std::nullopt, row.release && row.release != StringPool::Id::Null() ? std::make_optional(*row.release) : std::nullopt, row.version && row.version != StringPool::Id::Null() ? std::make_optional(*row.version) : std::nullopt, row.arch && row.arch != StringPool::Id::Null() ? std::make_optional(*row.arch) : std::nullopt, row.num_cpus, row.android_build_fingerprint && row.android_build_fingerprint != StringPool::Id::Null() ? std::make_optional(*row.android_build_fingerprint) : std::nullopt, row.android_device_manufacturer && row.android_device_manufacturer != StringPool::Id::Null() ? std::make_optional(*row.android_device_manufacturer) : std::nullopt, row.android_sdk_version);
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
    return "machine";
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



class ProcessTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","pid","name","start_ts","end_ts","parent_upid","uid","android_appid","android_user_id","cmdline","arg_set_id","machine_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ProcessTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ProcessTable& table) const {
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
    static constexpr uint32_t pid = 1;
    static constexpr uint32_t name = 2;
    static constexpr uint32_t start_ts = 3;
    static constexpr uint32_t end_ts = 4;
    static constexpr uint32_t parent_upid = 5;
    static constexpr uint32_t uid = 6;
    static constexpr uint32_t android_appid = 7;
    static constexpr uint32_t android_user_id = 8;
    static constexpr uint32_t cmdline = 9;
    static constexpr uint32_t arg_set_id = 10;
    static constexpr uint32_t machine_id = 11;
  };
  struct RowReference {
   public:
    explicit RowReference(ProcessTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    uint32_t id() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t pid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::pid>(kSpec, row_);
    }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> start_ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_);
    }
        std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_);
    }
          std::optional<uint32_t> parent_upid() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
        std::optional<uint32_t> uid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::uid>(kSpec, row_);
    }
        std::optional<uint32_t> android_appid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_appid>(kSpec, row_);
    }
        std::optional<uint32_t> android_user_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_user_id>(kSpec, row_);
    }
          std::optional<StringPool::Id> cmdline() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
        void set_start_ts(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_, res);
    }
        void set_end_ts(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_, res);
    }
        void set_parent_upid(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_upid>(kSpec, row_, res);
    }
        void set_uid(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::uid>(kSpec, row_, res);
    }
        void set_android_appid(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::android_appid>(kSpec, row_, res);
    }
        void set_android_user_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::android_user_id>(kSpec, row_, res);
    }
          void set_cmdline(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_, res_value);
    }
        void set_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ProcessTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ProcessTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    uint32_t id() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t pid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::pid>(kSpec, row_);
    }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> start_ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_);
    }
        std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_);
    }
          std::optional<uint32_t> parent_upid() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
        std::optional<uint32_t> uid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::uid>(kSpec, row_);
    }
        std::optional<uint32_t> android_appid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_appid>(kSpec, row_);
    }
        std::optional<uint32_t> android_user_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_user_id>(kSpec, row_);
    }
          std::optional<StringPool::Id> cmdline() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ProcessTable* table_;
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
    uint32_t id() const {
        
        return uint32_t{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t pid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::pid>(kSpec);
    }
      std::optional<StringPool::Id> name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<int64_t> start_ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::start_ts>(kSpec);
    }
    std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::end_ts>(kSpec);
    }
      std::optional<uint32_t> parent_upid() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_upid>(kSpec);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
    std::optional<uint32_t> uid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::uid>(kSpec);
    }
    std::optional<uint32_t> android_appid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::android_appid>(kSpec);
    }
    std::optional<uint32_t> android_user_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::android_user_id>(kSpec);
    }
      std::optional<StringPool::Id> cmdline() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::cmdline>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
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

    uint32_t id() const {
        
        return uint32_t{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t pid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::pid>(kSpec);
    }
      std::optional<StringPool::Id> name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<int64_t> start_ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::start_ts>(kSpec);
    }
    std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::end_ts>(kSpec);
    }
      std::optional<uint32_t> parent_upid() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::parent_upid>(kSpec);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
    std::optional<uint32_t> uid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::uid>(kSpec);
    }
    std::optional<uint32_t> android_appid() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::android_appid>(kSpec);
    }
    std::optional<uint32_t> android_user_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::android_user_id>(kSpec);
    }
      std::optional<StringPool::Id> cmdline() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::cmdline>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<uint32_t> arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::name>(kSpec, res_value);
    }
    void set_start_ts(std::optional<int64_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::start_ts>(kSpec, res);
    }
    void set_end_ts(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::end_ts>(kSpec, res);
    }
    void set_parent_upid(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::parent_upid>(kSpec, res);
    }
    void set_uid(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::uid>(kSpec, res);
    }
    void set_android_appid(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::android_appid>(kSpec, res);
    }
    void set_android_user_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::android_user_id>(kSpec, res);
    }
      void set_cmdline(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::cmdline>(kSpec, res_value);
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
      explicit Iterator(ProcessTable* table) : table_(table) {
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
      uint32_t id() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t pid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::pid>(kSpec, row_);
    }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> start_ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_);
    }
        std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_);
    }
          std::optional<uint32_t> parent_upid() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
        std::optional<uint32_t> uid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::uid>(kSpec, row_);
    }
        std::optional<uint32_t> android_appid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_appid>(kSpec, row_);
    }
        std::optional<uint32_t> android_user_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_user_id>(kSpec, row_);
    }
          std::optional<StringPool::Id> cmdline() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
      void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
        void set_start_ts(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_, res);
    }
        void set_end_ts(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_, res);
    }
        void set_parent_upid(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::parent_upid>(kSpec, row_, res);
    }
        void set_uid(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::uid>(kSpec, row_, res);
    }
        void set_android_appid(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::android_appid>(kSpec, row_, res);
    }
        void set_android_user_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::android_user_id>(kSpec, row_, res);
    }
          void set_cmdline(std::optional<StringPool::Id> res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_, res_value);
    }
        void set_arg_set_id(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }

    private:
      ProcessTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ProcessTable* table) : table_(table) {
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
      uint32_t id() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t pid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::pid>(kSpec, row_);
    }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> start_ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_);
    }
        std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_);
    }
          std::optional<uint32_t> parent_upid() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::parent_upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
        std::optional<uint32_t> uid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::uid>(kSpec, row_);
    }
        std::optional<uint32_t> android_appid() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_appid>(kSpec, row_);
    }
        std::optional<uint32_t> android_user_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::android_user_id>(kSpec, row_);
    }
          std::optional<StringPool::Id> cmdline() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::cmdline>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<uint32_t> arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }

    private:
      const ProcessTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _pid = {}, std::optional<StringPool::Id> _name = {}, std::optional<int64_t> _start_ts = {}, std::optional<int64_t> _end_ts = {}, std::optional<uint32_t> _parent_upid = {}, std::optional<uint32_t> _uid = {}, std::optional<uint32_t> _android_appid = {}, std::optional<uint32_t> _android_user_id = {}, std::optional<StringPool::Id> _cmdline = {}, std::optional<uint32_t> _arg_set_id = {}, std::optional<MachineTable::Id> _machine_id = {}) : pid(std::move(_pid)), name(std::move(_name)), start_ts(std::move(_start_ts)), end_ts(std::move(_end_ts)), parent_upid(std::move(_parent_upid)), uid(std::move(_uid)), android_appid(std::move(_android_appid)), android_user_id(std::move(_android_user_id)), cmdline(std::move(_cmdline)), arg_set_id(std::move(_arg_set_id)), machine_id(std::move(_machine_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(pid, name, start_ts, end_ts, parent_upid, uid, android_appid, android_user_id, cmdline, arg_set_id, machine_id) ==
             std::tie(other.pid, other.name, other.start_ts, other.end_ts, other.parent_upid, other.uid, other.android_appid, other.android_user_id, other.cmdline, other.arg_set_id, other.machine_id);
    }

        int64_t pid;
    std::optional<StringPool::Id> name;
    std::optional<int64_t> start_ts;
    std::optional<int64_t> end_ts;
    std::optional<uint32_t> parent_upid;
    std::optional<uint32_t> uid;
    std::optional<uint32_t> android_appid;
    std::optional<uint32_t> android_user_id;
    std::optional<StringPool::Id> cmdline;
    std::optional<uint32_t> arg_set_id;
    std::optional<MachineTable::Id> machine_id;
  };

  explicit ProcessTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.pid, row.name && row.name != StringPool::Id::Null() ? std::make_optional(*row.name) : std::nullopt, row.start_ts, row.end_ts, row.parent_upid, row.uid, row.android_appid, row.android_user_id, row.cmdline && row.cmdline != StringPool::Id::Null() ? std::make_optional(*row.cmdline) : std::nullopt, row.arg_set_id, row.machine_id ? std::make_optional(row.machine_id->value) : std::nullopt);
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
    return "__intrinsic_process";
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



class ThreadTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","tid","name","start_ts","end_ts","upid","is_main_thread","is_idle","machine_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ThreadTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ThreadTable& table) const {
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
    static constexpr uint32_t tid = 1;
    static constexpr uint32_t name = 2;
    static constexpr uint32_t start_ts = 3;
    static constexpr uint32_t end_ts = 4;
    static constexpr uint32_t upid = 5;
    static constexpr uint32_t is_main_thread = 6;
    static constexpr uint32_t is_idle = 7;
    static constexpr uint32_t machine_id = 8;
  };
  struct RowReference {
   public:
    explicit RowReference(ThreadTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    uint32_t id() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t tid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::tid>(kSpec, row_);
    }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> start_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_);
    }
        std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_);
    }
          std::optional<uint32_t> upid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
        std::optional<uint32_t> is_main_thread() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::is_main_thread>(kSpec, row_);
    }
          std::optional<MachineTable::Id> machine_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::machine_id>(kSpec, row_);
        return res ? std::make_optional(MachineTable::Id{*res}) : std::nullopt;
      }
    void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
        void set_start_ts(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_, res);
    }
        void set_end_ts(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_, res);
    }
        void set_upid(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::upid>(kSpec, row_, res);
    }
        void set_is_main_thread(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::is_main_thread>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ThreadTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ThreadTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    uint32_t id() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t tid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::tid>(kSpec, row_);
    }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> start_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_);
    }
        std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_);
    }
          std::optional<uint32_t> upid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
        std::optional<uint32_t> is_main_thread() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::is_main_thread>(kSpec, row_);
    }
          std::optional<MachineTable::Id> machine_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::machine_id>(kSpec, row_);
        return res ? std::make_optional(MachineTable::Id{*res}) : std::nullopt;
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ThreadTable* table_;
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
    uint32_t id() const {
        
        return uint32_t{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t tid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::tid>(kSpec);
    }
      std::optional<StringPool::Id> name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<int64_t> start_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::start_ts>(kSpec);
    }
    std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::end_ts>(kSpec);
    }
      std::optional<uint32_t> upid() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
    std::optional<uint32_t> is_main_thread() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::is_main_thread>(kSpec);
    }
      std::optional<MachineTable::Id> machine_id() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::machine_id>(kSpec);
        return res ? std::make_optional(MachineTable::Id{*res}) : std::nullopt;
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

    uint32_t id() const {
        
        return uint32_t{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t tid() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::tid>(kSpec);
    }
      std::optional<StringPool::Id> name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<int64_t> start_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::start_ts>(kSpec);
    }
    std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::end_ts>(kSpec);
    }
      std::optional<uint32_t> upid() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::upid>(kSpec);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
    std::optional<uint32_t> is_main_thread() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::is_main_thread>(kSpec);
    }
      std::optional<MachineTable::Id> machine_id() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::machine_id>(kSpec);
        return res ? std::make_optional(MachineTable::Id{*res}) : std::nullopt;
      }
    void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::name>(kSpec, res_value);
    }
    void set_start_ts(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::start_ts>(kSpec, res);
    }
    void set_end_ts(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::end_ts>(kSpec, res);
    }
    void set_upid(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::upid>(kSpec, res);
    }
    void set_is_main_thread(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::is_main_thread>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ThreadTable* table) : table_(table) {
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
      uint32_t id() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t tid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::tid>(kSpec, row_);
    }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> start_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_);
    }
        std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_);
    }
          std::optional<uint32_t> upid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
        std::optional<uint32_t> is_main_thread() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::is_main_thread>(kSpec, row_);
    }
          std::optional<MachineTable::Id> machine_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::machine_id>(kSpec, row_);
        return res ? std::make_optional(MachineTable::Id{*res}) : std::nullopt;
      }
      void set_name(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::name>(kSpec, row_, res_value);
    }
        void set_start_ts(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_, res);
    }
        void set_end_ts(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_, res);
    }
        void set_upid(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::upid>(kSpec, row_, res);
    }
        void set_is_main_thread(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::is_main_thread>(kSpec, row_, res);
    }

    private:
      ThreadTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ThreadTable* table) : table_(table) {
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
      uint32_t id() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t tid() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::tid>(kSpec, row_);
    }
          std::optional<StringPool::Id> name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<int64_t> start_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::start_ts>(kSpec, row_);
    }
        std::optional<int64_t> end_ts() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::end_ts>(kSpec, row_);
    }
          std::optional<uint32_t> upid() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::upid>(kSpec, row_);
        return res ? std::make_optional(uint32_t{*res}) : std::nullopt;
      }
        std::optional<uint32_t> is_main_thread() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::is_main_thread>(kSpec, row_);
    }
          std::optional<MachineTable::Id> machine_id() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::machine_id>(kSpec, row_);
        return res ? std::make_optional(MachineTable::Id{*res}) : std::nullopt;
      }

    private:
      const ThreadTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _tid = {}, std::optional<StringPool::Id> _name = {}, std::optional<int64_t> _start_ts = {}, std::optional<int64_t> _end_ts = {}, std::optional<uint32_t> _upid = {}, std::optional<uint32_t> _is_main_thread = {}, uint32_t _is_idle = {}, std::optional<MachineTable::Id> _machine_id = {}) : tid(std::move(_tid)), name(std::move(_name)), start_ts(std::move(_start_ts)), end_ts(std::move(_end_ts)), upid(std::move(_upid)), is_main_thread(std::move(_is_main_thread)), is_idle(std::move(_is_idle)), machine_id(std::move(_machine_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(tid, name, start_ts, end_ts, upid, is_main_thread, is_idle, machine_id) ==
             std::tie(other.tid, other.name, other.start_ts, other.end_ts, other.upid, other.is_main_thread, other.is_idle, other.machine_id);
    }

        int64_t tid;
    std::optional<StringPool::Id> name;
    std::optional<int64_t> start_ts;
    std::optional<int64_t> end_ts;
    std::optional<uint32_t> upid;
    std::optional<uint32_t> is_main_thread;
    uint32_t is_idle;
    std::optional<MachineTable::Id> machine_id;
  };

  explicit ThreadTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.tid, row.name && row.name != StringPool::Id::Null() ? std::make_optional(*row.name) : std::nullopt, row.start_ts, row.end_ts, row.upid, row.is_main_thread, row.is_idle, row.machine_id ? std::make_optional(row.machine_id->value) : std::nullopt);
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
    return "__intrinsic_thread";
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



class ArgTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","arg_set_id","flat_key","key","int_value","string_value","real_value","value_type"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::SetIdSorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountUntilFinalization{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Double{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ArgTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ArgTable& table) const {
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
    static constexpr uint32_t arg_set_id = 1;
    static constexpr uint32_t flat_key = 2;
    static constexpr uint32_t key = 3;
    static constexpr uint32_t int_value = 4;
    static constexpr uint32_t string_value = 5;
    static constexpr uint32_t real_value = 6;
    static constexpr uint32_t value_type = 7;
  };
  struct RowReference {
   public:
    explicit RowReference(ArgTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ArgTable::Id id() const {
        
        return ArgTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
          StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::flat_key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id key() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> int_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::int_value>(kSpec, row_);
    }
          std::optional<StringPool::Id> string_value() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::string_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<double> real_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::real_value>(kSpec, row_);
    }
          StringPool::Id value_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::value_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ArgTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ArgTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ArgTable::Id id() const {
        
        return ArgTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
          StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::flat_key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id key() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> int_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::int_value>(kSpec, row_);
    }
          std::optional<StringPool::Id> string_value() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::string_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<double> real_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::real_value>(kSpec, row_);
    }
          StringPool::Id value_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::value_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ArgTable* table_;
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
    ArgTable::Id id() const {
        
        return ArgTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
      StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::flat_key>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id key() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::key>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<int64_t> int_value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::int_value>(kSpec);
    }
      std::optional<StringPool::Id> string_value() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::string_value>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<double> real_value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::real_value>(kSpec);
    }
      StringPool::Id value_type() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::value_type>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
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

    ArgTable::Id id() const {
        
        return ArgTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    uint32_t arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
      StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::flat_key>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      StringPool::Id key() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::key>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<int64_t> int_value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::int_value>(kSpec);
    }
      std::optional<StringPool::Id> string_value() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::string_value>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    std::optional<double> real_value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::real_value>(kSpec);
    }
      StringPool::Id value_type() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::value_type>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ArgTable* table) : table_(table) {
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
      ArgTable::Id id() const {
        
        return ArgTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
          StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::flat_key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id key() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> int_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::int_value>(kSpec, row_);
    }
          std::optional<StringPool::Id> string_value() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::string_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<double> real_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::real_value>(kSpec, row_);
    }
          StringPool::Id value_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::value_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
      

    private:
      ArgTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ArgTable* table) : table_(table) {
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
      ArgTable::Id id() const {
        
        return ArgTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
          StringPool::Id flat_key() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::flat_key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          StringPool::Id key() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::key>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> int_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::int_value>(kSpec, row_);
    }
          std::optional<StringPool::Id> string_value() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::string_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
        std::optional<double> real_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::real_value>(kSpec, row_);
    }
          StringPool::Id value_type() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::value_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }

    private:
      const ArgTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _arg_set_id = {}, StringPool::Id _flat_key = {}, StringPool::Id _key = {}, std::optional<int64_t> _int_value = {}, std::optional<StringPool::Id> _string_value = {}, std::optional<double> _real_value = {}, StringPool::Id _value_type = {}) : arg_set_id(std::move(_arg_set_id)), flat_key(std::move(_flat_key)), key(std::move(_key)), int_value(std::move(_int_value)), string_value(std::move(_string_value)), real_value(std::move(_real_value)), value_type(std::move(_value_type)) {}

    bool operator==(const Row& other) const {
      return std::tie(arg_set_id, flat_key, key, int_value, string_value, real_value, value_type) ==
             std::tie(other.arg_set_id, other.flat_key, other.key, other.int_value, other.string_value, other.real_value, other.value_type);
    }

        uint32_t arg_set_id;
    StringPool::Id flat_key;
    StringPool::Id key;
    std::optional<int64_t> int_value;
    std::optional<StringPool::Id> string_value;
    std::optional<double> real_value;
    StringPool::Id value_type;
  };

  explicit ArgTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.arg_set_id, row.flat_key != StringPool::Id::Null() ? std::make_optional(row.flat_key) : std::nullopt, row.key != StringPool::Id::Null() ? std::make_optional(row.key) : std::nullopt, row.int_value, row.string_value && row.string_value != StringPool::Id::Null() ? std::make_optional(*row.string_value) : std::nullopt, row.real_value, row.value_type != StringPool::Id::Null() ? std::make_optional(row.value_type) : std::nullopt);
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
    return "__intrinsic_args";
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



class BuildFlagsTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","name","enabled"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(BuildFlagsTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const BuildFlagsTable& table) const {
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
    static constexpr uint32_t enabled = 2;
  };
  struct RowReference {
   public:
    explicit RowReference(BuildFlagsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    BuildFlagsTable::Id id() const {
        
        return BuildFlagsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    BuildFlagsTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const BuildFlagsTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    BuildFlagsTable::Id id() const {
        
        return BuildFlagsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const BuildFlagsTable* table_;
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
    BuildFlagsTable::Id id() const {
        
        return BuildFlagsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
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

    BuildFlagsTable::Id id() const {
        
        return BuildFlagsTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(BuildFlagsTable* table) : table_(table) {
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
      BuildFlagsTable::Id id() const {
        
        return BuildFlagsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      BuildFlagsTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const BuildFlagsTable* table) : table_(table) {
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
      BuildFlagsTable::Id id() const {
        
        return BuildFlagsTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const BuildFlagsTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _name = {}, uint32_t _enabled = {}) : name(std::move(_name)), enabled(std::move(_enabled)) {}

    bool operator==(const Row& other) const {
      return std::tie(name, enabled) ==
             std::tie(other.name, other.enabled);
    }

        StringPool::Id name;
    uint32_t enabled;
  };

  explicit BuildFlagsTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.enabled);
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
    return "__intrinsic_build_flags";
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



class ChromeRawTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","name","utid","arg_set_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ChromeRawTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ChromeRawTable& table) const {
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
    static constexpr uint32_t name = 2;
    static constexpr uint32_t utid = 3;
    static constexpr uint32_t arg_set_id = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(ChromeRawTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ChromeRawTable::Id id() const {
        
        return ChromeRawTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          uint32_t utid() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ChromeRawTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ChromeRawTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ChromeRawTable::Id id() const {
        
        return ChromeRawTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          uint32_t utid() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ChromeRawTable* table_;
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
    ChromeRawTable::Id id() const {
        
        return ChromeRawTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      uint32_t utid() const {
        
        return uint32_t{cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec)};
      }
    uint32_t arg_set_id() const {
      
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

    ChromeRawTable::Id id() const {
        
        return ChromeRawTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      uint32_t utid() const {
        
        return uint32_t{cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec)};
      }
    uint32_t arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ChromeRawTable* table) : table_(table) {
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
      ChromeRawTable::Id id() const {
        
        return ChromeRawTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          uint32_t utid() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
      

    private:
      ChromeRawTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ChromeRawTable* table) : table_(table) {
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
      ChromeRawTable::Id id() const {
        
        return ChromeRawTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          uint32_t utid() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }

    private:
      const ChromeRawTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, StringPool::Id _name = {}, uint32_t _utid = {}, uint32_t _arg_set_id = {}) : ts(std::move(_ts)), name(std::move(_name)), utid(std::move(_utid)), arg_set_id(std::move(_arg_set_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, name, utid, arg_set_id) ==
             std::tie(other.ts, other.name, other.utid, other.arg_set_id);
    }

        int64_t ts;
    StringPool::Id name;
    uint32_t utid;
    uint32_t arg_set_id;
  };

  explicit ChromeRawTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.utid, row.arg_set_id);
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
    return "__intrinsic_chrome_raw";
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



class ClockSnapshotTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","clock_id","clock_name","clock_value","snapshot_id","machine_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ClockSnapshotTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ClockSnapshotTable& table) const {
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
    static constexpr uint32_t clock_id = 2;
    static constexpr uint32_t clock_name = 3;
    static constexpr uint32_t clock_value = 4;
    static constexpr uint32_t snapshot_id = 5;
    static constexpr uint32_t machine_id = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(ClockSnapshotTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ClockSnapshotTable::Id id() const {
        
        return ClockSnapshotTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t clock_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::clock_id>(kSpec, row_);
    }
        int64_t clock_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::clock_value>(kSpec, row_);
    }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ClockSnapshotTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ClockSnapshotTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ClockSnapshotTable::Id id() const {
        
        return ClockSnapshotTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t clock_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::clock_id>(kSpec, row_);
    }
        int64_t clock_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::clock_value>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ClockSnapshotTable* table_;
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
    ClockSnapshotTable::Id id() const {
        
        return ClockSnapshotTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    int64_t clock_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::clock_id>(kSpec);
    }
    int64_t clock_value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::clock_value>(kSpec);
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

    ClockSnapshotTable::Id id() const {
        
        return ClockSnapshotTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
    int64_t clock_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::clock_id>(kSpec);
    }
    int64_t clock_value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::clock_value>(kSpec);
    }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ClockSnapshotTable* table) : table_(table) {
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
      ClockSnapshotTable::Id id() const {
        
        return ClockSnapshotTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t clock_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::clock_id>(kSpec, row_);
    }
        int64_t clock_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::clock_value>(kSpec, row_);
    }
      

    private:
      ClockSnapshotTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ClockSnapshotTable* table) : table_(table) {
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
      ClockSnapshotTable::Id id() const {
        
        return ClockSnapshotTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
        int64_t clock_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::clock_id>(kSpec, row_);
    }
        int64_t clock_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::clock_value>(kSpec, row_);
    }

    private:
      const ClockSnapshotTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, int64_t _clock_id = {}, std::optional<StringPool::Id> _clock_name = {}, int64_t _clock_value = {}, uint32_t _snapshot_id = {}, std::optional<MachineTable::Id> _machine_id = {}) : ts(std::move(_ts)), clock_id(std::move(_clock_id)), clock_name(std::move(_clock_name)), clock_value(std::move(_clock_value)), snapshot_id(std::move(_snapshot_id)), machine_id(std::move(_machine_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, clock_id, clock_name, clock_value, snapshot_id, machine_id) ==
             std::tie(other.ts, other.clock_id, other.clock_name, other.clock_value, other.snapshot_id, other.machine_id);
    }

        int64_t ts;
    int64_t clock_id;
    std::optional<StringPool::Id> clock_name;
    int64_t clock_value;
    uint32_t snapshot_id;
    std::optional<MachineTable::Id> machine_id;
  };

  explicit ClockSnapshotTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.clock_id, row.clock_name && row.clock_name != StringPool::Id::Null() ? std::make_optional(*row.clock_name) : std::nullopt, row.clock_value, row.snapshot_id, row.machine_id ? std::make_optional(row.machine_id->value) : std::nullopt);
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
    return "clock_snapshot";
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



class CpuTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","cpu","cluster_id","processor","machine_id","capacity","arg_set_id"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(CpuTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const CpuTable& table) const {
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
    static constexpr uint32_t cpu = 1;
    static constexpr uint32_t cluster_id = 2;
    static constexpr uint32_t processor = 3;
    static constexpr uint32_t machine_id = 4;
    static constexpr uint32_t capacity = 5;
    static constexpr uint32_t arg_set_id = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(CpuTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    CpuTable::Id id() const {
        
        return CpuTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> cpu() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cpu>(kSpec, row_);
    }
        uint32_t cluster_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cluster_id>(kSpec, row_);
    }
          StringPool::Id processor() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::processor>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> capacity() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::capacity>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    void set_cpu(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cpu>(kSpec, row_, res);
    }
        void set_cluster_id(uint32_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cluster_id>(kSpec, row_, res);
    }
          void set_processor(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::processor>(kSpec, row_, res_value);
    }
        void set_capacity(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::capacity>(kSpec, row_, res);
    }
        void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    CpuTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const CpuTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    CpuTable::Id id() const {
        
        return CpuTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> cpu() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cpu>(kSpec, row_);
    }
        uint32_t cluster_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cluster_id>(kSpec, row_);
    }
          StringPool::Id processor() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::processor>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> capacity() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::capacity>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const CpuTable* table_;
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
    CpuTable::Id id() const {
        
        return CpuTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> cpu() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::cpu>(kSpec);
    }
    uint32_t cluster_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cluster_id>(kSpec);
    }
      StringPool::Id processor() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::processor>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<uint32_t> capacity() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::capacity>(kSpec);
    }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
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

    CpuTable::Id id() const {
        
        return CpuTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    std::optional<uint32_t> cpu() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::cpu>(kSpec);
    }
    uint32_t cluster_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::cluster_id>(kSpec);
    }
      StringPool::Id processor() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::processor>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<uint32_t> capacity() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::capacity>(kSpec);
    }
    std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
    void set_cpu(std::optional<uint32_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::cpu>(kSpec, res);
    }
    void set_cluster_id(uint32_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::cluster_id>(kSpec, res);
    }
      void set_processor(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::processor>(kSpec, res_value);
    }
    void set_capacity(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::capacity>(kSpec, res);
    }
    void set_arg_set_id(std::optional<uint32_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(CpuTable* table) : table_(table) {
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
      CpuTable::Id id() const {
        
        return CpuTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> cpu() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cpu>(kSpec, row_);
    }
        uint32_t cluster_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cluster_id>(kSpec, row_);
    }
          StringPool::Id processor() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::processor>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> capacity() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::capacity>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
      void set_cpu(std::optional<uint32_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cpu>(kSpec, row_, res);
    }
        void set_cluster_id(uint32_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::cluster_id>(kSpec, row_, res);
    }
          void set_processor(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::processor>(kSpec, row_, res_value);
    }
        void set_capacity(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::capacity>(kSpec, row_, res);
    }
        void set_arg_set_id(std::optional<uint32_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_, res);
    }

    private:
      CpuTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const CpuTable* table) : table_(table) {
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
      CpuTable::Id id() const {
        
        return CpuTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        std::optional<uint32_t> cpu() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cpu>(kSpec, row_);
    }
        uint32_t cluster_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::cluster_id>(kSpec, row_);
    }
          StringPool::Id processor() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::processor>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<uint32_t> capacity() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::capacity>(kSpec, row_);
    }
        std::optional<uint32_t> arg_set_id() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }

    private:
      const CpuTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(std::optional<uint32_t> _cpu = {}, uint32_t _cluster_id = {}, StringPool::Id _processor = {}, std::optional<MachineTable::Id> _machine_id = {}, std::optional<uint32_t> _capacity = {}, std::optional<uint32_t> _arg_set_id = {}) : cpu(std::move(_cpu)), cluster_id(std::move(_cluster_id)), processor(std::move(_processor)), machine_id(std::move(_machine_id)), capacity(std::move(_capacity)), arg_set_id(std::move(_arg_set_id)) {}

    bool operator==(const Row& other) const {
      return std::tie(cpu, cluster_id, processor, machine_id, capacity, arg_set_id) ==
             std::tie(other.cpu, other.cluster_id, other.processor, other.machine_id, other.capacity, other.arg_set_id);
    }

        std::optional<uint32_t> cpu;
    uint32_t cluster_id;
    StringPool::Id processor;
    std::optional<MachineTable::Id> machine_id;
    std::optional<uint32_t> capacity;
    std::optional<uint32_t> arg_set_id;
  };

  explicit CpuTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.cpu, row.cluster_id, row.processor != StringPool::Id::Null() ? std::make_optional(row.processor) : std::nullopt, row.machine_id ? std::make_optional(row.machine_id->value) : std::nullopt, row.capacity, row.arg_set_id);
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
    return "__intrinsic_cpu";
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



class CpuFreqTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ucpu","freq"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(CpuFreqTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const CpuFreqTable& table) const {
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
    static constexpr uint32_t ucpu = 1;
    static constexpr uint32_t freq = 2;
  };
  struct RowReference {
   public:
    explicit RowReference(CpuFreqTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    CpuFreqTable::Id id() const {
        
        return CpuFreqTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    CpuFreqTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const CpuFreqTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    CpuFreqTable::Id id() const {
        
        return CpuFreqTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const CpuFreqTable* table_;
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
    CpuFreqTable::Id id() const {
        
        return CpuFreqTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
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

    CpuFreqTable::Id id() const {
        
        return CpuFreqTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(CpuFreqTable* table) : table_(table) {
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
      CpuFreqTable::Id id() const {
        
        return CpuFreqTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      CpuFreqTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const CpuFreqTable* table) : table_(table) {
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
      CpuFreqTable::Id id() const {
        
        return CpuFreqTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const CpuFreqTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(CpuTable::Id _ucpu = {}, uint32_t _freq = {}) : ucpu(std::move(_ucpu)), freq(std::move(_freq)) {}

    bool operator==(const Row& other) const {
      return std::tie(ucpu, freq) ==
             std::tie(other.ucpu, other.freq);
    }

        CpuTable::Id ucpu;
    uint32_t freq;
  };

  explicit CpuFreqTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ucpu.value, row.freq);
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
    return "__intrinsic_cpu_freq";
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



class ExpMissingChromeProcTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","upid","reliable_from"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ExpMissingChromeProcTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ExpMissingChromeProcTable& table) const {
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
    static constexpr uint32_t upid = 1;
    static constexpr uint32_t reliable_from = 2;
  };
  struct RowReference {
   public:
    explicit RowReference(ExpMissingChromeProcTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ExpMissingChromeProcTable::Id id() const {
        
        return ExpMissingChromeProcTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ExpMissingChromeProcTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ExpMissingChromeProcTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ExpMissingChromeProcTable::Id id() const {
        
        return ExpMissingChromeProcTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ExpMissingChromeProcTable* table_;
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
    ExpMissingChromeProcTable::Id id() const {
        
        return ExpMissingChromeProcTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
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

    ExpMissingChromeProcTable::Id id() const {
        
        return ExpMissingChromeProcTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ExpMissingChromeProcTable* table) : table_(table) {
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
      ExpMissingChromeProcTable::Id id() const {
        
        return ExpMissingChromeProcTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      ExpMissingChromeProcTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ExpMissingChromeProcTable* table) : table_(table) {
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
      ExpMissingChromeProcTable::Id id() const {
        
        return ExpMissingChromeProcTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const ExpMissingChromeProcTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(uint32_t _upid = {}, std::optional<int64_t> _reliable_from = {}) : upid(std::move(_upid)), reliable_from(std::move(_reliable_from)) {}

    bool operator==(const Row& other) const {
      return std::tie(upid, reliable_from) ==
             std::tie(other.upid, other.reliable_from);
    }

        uint32_t upid;
    std::optional<int64_t> reliable_from;
  };

  explicit ExpMissingChromeProcTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.upid, row.reliable_from);
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
    return "experimental_missing_chrome_processes";
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



class FiledescriptorTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ufd","fd","ts","upid","path"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(FiledescriptorTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const FiledescriptorTable& table) const {
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
    static constexpr uint32_t ufd = 1;
    static constexpr uint32_t fd = 2;
    static constexpr uint32_t ts = 3;
    static constexpr uint32_t upid = 4;
    static constexpr uint32_t path = 5;
  };
  struct RowReference {
   public:
    explicit RowReference(FiledescriptorTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    FiledescriptorTable::Id id() const {
        
        return FiledescriptorTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    FiledescriptorTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const FiledescriptorTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    FiledescriptorTable::Id id() const {
        
        return FiledescriptorTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const FiledescriptorTable* table_;
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
    FiledescriptorTable::Id id() const {
        
        return FiledescriptorTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
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

    FiledescriptorTable::Id id() const {
        
        return FiledescriptorTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(FiledescriptorTable* table) : table_(table) {
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
      FiledescriptorTable::Id id() const {
        
        return FiledescriptorTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      FiledescriptorTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const FiledescriptorTable* table) : table_(table) {
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
      FiledescriptorTable::Id id() const {
        
        return FiledescriptorTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const FiledescriptorTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ufd = {}, int64_t _fd = {}, std::optional<int64_t> _ts = {}, std::optional<uint32_t> _upid = {}, std::optional<StringPool::Id> _path = {}) : ufd(std::move(_ufd)), fd(std::move(_fd)), ts(std::move(_ts)), upid(std::move(_upid)), path(std::move(_path)) {}

    bool operator==(const Row& other) const {
      return std::tie(ufd, fd, ts, upid, path) ==
             std::tie(other.ufd, other.fd, other.ts, other.upid, other.path);
    }

        int64_t ufd;
    int64_t fd;
    std::optional<int64_t> ts;
    std::optional<uint32_t> upid;
    std::optional<StringPool::Id> path;
  };

  explicit FiledescriptorTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ufd, row.fd, row.ts, row.upid, row.path && row.path != StringPool::Id::Null() ? std::make_optional(*row.path) : std::nullopt);
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
    return "filedescriptor";
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



class FtraceEventTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","ts","name","utid","arg_set_id","common_flags","ucpu"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Sorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(FtraceEventTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const FtraceEventTable& table) const {
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
    static constexpr uint32_t name = 2;
    static constexpr uint32_t utid = 3;
    static constexpr uint32_t arg_set_id = 4;
    static constexpr uint32_t common_flags = 5;
    static constexpr uint32_t ucpu = 6;
  };
  struct RowReference {
   public:
    explicit RowReference(FtraceEventTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    FtraceEventTable::Id id() const {
        
        return FtraceEventTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          uint32_t utid() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
          CpuTable::Id ucpu() const {
        
        return CpuTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::ucpu>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    FtraceEventTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const FtraceEventTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    FtraceEventTable::Id id() const {
        
        return FtraceEventTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          uint32_t utid() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
          CpuTable::Id ucpu() const {
        
        return CpuTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::ucpu>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const FtraceEventTable* table_;
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
    FtraceEventTable::Id id() const {
        
        return FtraceEventTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      uint32_t utid() const {
        
        return uint32_t{cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec)};
      }
    uint32_t arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
      CpuTable::Id ucpu() const {
        
        return CpuTable::Id{cursor_.GetCellUnchecked<ColumnIndex::ucpu>(kSpec)};
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

    FtraceEventTable::Id id() const {
        
        return FtraceEventTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t ts() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::ts>(kSpec);
    }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
      uint32_t utid() const {
        
        return uint32_t{cursor_.GetCellUnchecked<ColumnIndex::utid>(kSpec)};
      }
    uint32_t arg_set_id() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec);
    }
      CpuTable::Id ucpu() const {
        
        return CpuTable::Id{cursor_.GetCellUnchecked<ColumnIndex::ucpu>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(FtraceEventTable* table) : table_(table) {
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
      FtraceEventTable::Id id() const {
        
        return FtraceEventTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          uint32_t utid() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
          CpuTable::Id ucpu() const {
        
        return CpuTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::ucpu>(kSpec, row_)};
      }
      

    private:
      FtraceEventTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const FtraceEventTable* table) : table_(table) {
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
      FtraceEventTable::Id id() const {
        
        return FtraceEventTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t ts() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::ts>(kSpec, row_);
    }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
          uint32_t utid() const {
        
        return uint32_t{table_->dataframe_.template GetCellUnchecked<ColumnIndex::utid>(kSpec, row_)};
      }
        uint32_t arg_set_id() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::arg_set_id>(kSpec, row_);
    }
          CpuTable::Id ucpu() const {
        
        return CpuTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::ucpu>(kSpec, row_)};
      }

    private:
      const FtraceEventTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(int64_t _ts = {}, StringPool::Id _name = {}, uint32_t _utid = {}, uint32_t _arg_set_id = {}, uint32_t _common_flags = {}, CpuTable::Id _ucpu = {}) : ts(std::move(_ts)), name(std::move(_name)), utid(std::move(_utid)), arg_set_id(std::move(_arg_set_id)), common_flags(std::move(_common_flags)), ucpu(std::move(_ucpu)) {}

    bool operator==(const Row& other) const {
      return std::tie(ts, name, utid, arg_set_id, common_flags, ucpu) ==
             std::tie(other.ts, other.name, other.utid, other.arg_set_id, other.common_flags, other.ucpu);
    }

        int64_t ts;
    StringPool::Id name;
    uint32_t utid;
    uint32_t arg_set_id;
    uint32_t common_flags;
    CpuTable::Id ucpu;
  };

  explicit FtraceEventTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.ts, row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.utid, row.arg_set_id, row.common_flags, row.ucpu.value);
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
    return "__intrinsic_ftrace_event";
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



class MetadataTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","name","key_type","int_value","str_value"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNullWithPopcountAlways{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(MetadataTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const MetadataTable& table) const {
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
    static constexpr uint32_t key_type = 2;
    static constexpr uint32_t int_value = 3;
    static constexpr uint32_t str_value = 4;
  };
  struct RowReference {
   public:
    explicit RowReference(MetadataTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    MetadataTable::Id id() const {
        
        return MetadataTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> int_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::int_value>(kSpec, row_);
    }
          std::optional<StringPool::Id> str_value() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::str_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    void set_int_value(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::int_value>(kSpec, row_, res);
    }
          void set_str_value(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::str_value>(kSpec, row_, res_value);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    MetadataTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const MetadataTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    MetadataTable::Id id() const {
        
        return MetadataTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> int_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::int_value>(kSpec, row_);
    }
          std::optional<StringPool::Id> str_value() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::str_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const MetadataTable* table_;
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
    MetadataTable::Id id() const {
        
        return MetadataTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<int64_t> int_value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::int_value>(kSpec);
    }
      std::optional<StringPool::Id> str_value() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::str_value>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
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

    MetadataTable::Id id() const {
        
        return MetadataTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
      StringPool::Id name() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::name>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<int64_t> int_value() const {
      
      return cursor_.GetCellUnchecked<ColumnIndex::int_value>(kSpec);
    }
      std::optional<StringPool::Id> str_value() const {
        
        auto res = cursor_.GetCellUnchecked<ColumnIndex::str_value>(kSpec);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
    void set_int_value(std::optional<int64_t> res) {
        
      cursor_.SetCellUnchecked<ColumnIndex::int_value>(kSpec, res);
    }
      void set_str_value(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::str_value>(kSpec, res_value);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(MetadataTable* table) : table_(table) {
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
      MetadataTable::Id id() const {
        
        return MetadataTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> int_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::int_value>(kSpec, row_);
    }
          std::optional<StringPool::Id> str_value() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::str_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }
      void set_int_value(std::optional<int64_t> res) {
      
      table_->dataframe_.SetCellUnchecked<ColumnIndex::int_value>(kSpec, row_, res);
    }
          void set_str_value(std::optional<StringPool::Id> res) {
        
        auto res_value = res && res != StringPool::Id::Null() ? std::make_optional(*res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::str_value>(kSpec, row_, res_value);
    }

    private:
      MetadataTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const MetadataTable* table) : table_(table) {
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
      MetadataTable::Id id() const {
        
        return MetadataTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
          StringPool::Id name() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::name>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> int_value() const {
      
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::int_value>(kSpec, row_);
    }
          std::optional<StringPool::Id> str_value() const {
        
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::str_value>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? std::make_optional(StringPool::Id{*res}) : std::nullopt;
      }

    private:
      const MetadataTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _name = {}, StringPool::Id _key_type = {}, std::optional<int64_t> _int_value = {}, std::optional<StringPool::Id> _str_value = {}) : name(std::move(_name)), key_type(std::move(_key_type)), int_value(std::move(_int_value)), str_value(std::move(_str_value)) {}

    bool operator==(const Row& other) const {
      return std::tie(name, key_type, int_value, str_value) ==
             std::tie(other.name, other.key_type, other.int_value, other.str_value);
    }

        StringPool::Id name;
    StringPool::Id key_type;
    std::optional<int64_t> int_value;
    std::optional<StringPool::Id> str_value;
  };

  explicit MetadataTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt, row.key_type != StringPool::Id::Null() ? std::make_optional(row.key_type) : std::nullopt, row.int_value, row.str_value && row.str_value != StringPool::Id::Null() ? std::make_optional(*row.str_value) : std::nullopt);
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
    return "metadata";
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



class ModulesTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","name"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(ModulesTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const ModulesTable& table) const {
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
  };
  struct RowReference {
   public:
    explicit RowReference(ModulesTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ModulesTable::Id id() const {
        
        return ModulesTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    ModulesTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const ModulesTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    ModulesTable::Id id() const {
        
        return ModulesTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const ModulesTable* table_;
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
    ModulesTable::Id id() const {
        
        return ModulesTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
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

    ModulesTable::Id id() const {
        
        return ModulesTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(ModulesTable* table) : table_(table) {
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
      ModulesTable::Id id() const {
        
        return ModulesTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
      

    private:
      ModulesTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const ModulesTable* table) : table_(table) {
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
      ModulesTable::Id id() const {
        
        return ModulesTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }

    private:
      const ModulesTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(StringPool::Id _name = {}) : name(std::move(_name)) {}

    bool operator==(const Row& other) const {
      return std::tie(name) ==
             std::tie(other.name);
    }

        StringPool::Id name;
  };

  explicit ModulesTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.name != StringPool::Id::Null() ? std::make_optional(row.name) : std::nullopt);
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
    return "__intrinsic_modules";
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



class TraceFileTable {
 public:
  static constexpr auto kSpec = dataframe::CreateTypedDataframeSpec(
    {"id","parent_id","name","size","trace_type","processing_order"},
    dataframe::CreateTypedColumnSpec(dataframe::Id{}, dataframe::NonNull{}, dataframe::IdSorted{}, dataframe::NoDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Uint32{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::SparseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::NonNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::String{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}),
    dataframe::CreateTypedColumnSpec(dataframe::Int64{}, dataframe::DenseNull{}, dataframe::Unsorted{}, dataframe::HasDuplicates{}));

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

    RowReference ToRowReference(TraceFileTable* table) const {
      return RowReference(table, value_);
    }
    ConstRowReference ToRowReference(const TraceFileTable& table) const {
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
    static constexpr uint32_t parent_id = 1;
    static constexpr uint32_t name = 2;
    static constexpr uint32_t size = 3;
    static constexpr uint32_t trace_type = 4;
    static constexpr uint32_t processing_order = 5;
  };
  struct RowReference {
   public:
    explicit RowReference(TraceFileTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    TraceFileTable::Id id() const {
        
        return TraceFileTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
          StringPool::Id trace_type() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::trace_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> processing_order() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::processing_order>(kSpec, row_);
    }
    void set_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::size>(kSpec, row_, res);
    }
          void set_trace_type(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::trace_type>(kSpec, row_, res_value);
    }
        void set_processing_order(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::processing_order>(kSpec, row_, res);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }

   private:
    friend struct ConstRowReference;
    TraceFileTable* table_;
    uint32_t row_;
  };
  struct ConstRowReference {
   public:
    explicit ConstRowReference(const TraceFileTable* table, uint32_t row)
        : table_(table), row_(row) {
        base::ignore_result(table_);
    }
    ConstRowReference(const RowReference& other)
        : table_(other.table_), row_(other.row_) {}
    TraceFileTable::Id id() const {
        
        return TraceFileTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
          StringPool::Id trace_type() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::trace_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> processing_order() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::processing_order>(kSpec, row_);
    }
    RowNumber ToRowNumber() const {
      return RowNumber{row_};
    }
   private:
    const TraceFileTable* table_;
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
    TraceFileTable::Id id() const {
        
        return TraceFileTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::size>(kSpec);
    }
      StringPool::Id trace_type() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::trace_type>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<int64_t> processing_order() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::processing_order>(kSpec);
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

    TraceFileTable::Id id() const {
        
        return TraceFileTable::Id{cursor_.GetCellUnchecked<ColumnIndex::id>(kSpec)};
      }
    int64_t size() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::size>(kSpec);
    }
      StringPool::Id trace_type() const {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res = cursor_.GetCellUnchecked<ColumnIndex::trace_type>(kSpec);
        return res && res != StringPool::Id::Null() ? *res : StringPool::Id::Null();
      }
    std::optional<int64_t> processing_order() const {
      PERFETTO_DCHECK(!dataframe_->finalized());
      return cursor_.GetCellUnchecked<ColumnIndex::processing_order>(kSpec);
    }
    void set_size(int64_t res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::size>(kSpec, res);
    }
      void set_trace_type(StringPool::Id res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        cursor_.SetCellUnchecked<ColumnIndex::trace_type>(kSpec, res_value);
    }
    void set_processing_order(std::optional<int64_t> res) {
        PERFETTO_DCHECK(!dataframe_->finalized());
      cursor_.SetCellUnchecked<ColumnIndex::processing_order>(kSpec, res);
    }

   private:
    dataframe::Dataframe* dataframe_;
    dataframe::TypedCursor cursor_;
  };
  class Iterator {
    public:
      explicit Iterator(TraceFileTable* table) : table_(table) {
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
      TraceFileTable::Id id() const {
        
        return TraceFileTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
          StringPool::Id trace_type() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::trace_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> processing_order() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::processing_order>(kSpec, row_);
    }
      void set_size(int64_t res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::size>(kSpec, row_, res);
    }
          void set_trace_type(StringPool::Id res) {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res_value = res != StringPool::Id::Null() ? std::make_optional(res) : std::nullopt;
        table_->dataframe_.SetCellUnchecked<ColumnIndex::trace_type>(kSpec, row_, res_value);
    }
        void set_processing_order(std::optional<int64_t> res) {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      table_->dataframe_.SetCellUnchecked<ColumnIndex::processing_order>(kSpec, row_, res);
    }

    private:
      TraceFileTable* table_;
      uint32_t row_ = 0;
  };
  class ConstIterator {
    public:
      explicit ConstIterator(const TraceFileTable* table) : table_(table) {
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
      TraceFileTable::Id id() const {
        
        return TraceFileTable::Id{table_->dataframe_.template GetCellUnchecked<ColumnIndex::id>(kSpec, row_)};
      }
        int64_t size() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::size>(kSpec, row_);
    }
          StringPool::Id trace_type() const {
        PERFETTO_DCHECK(!table_->dataframe_.finalized());
        auto res = table_->dataframe_.template GetCellUnchecked<ColumnIndex::trace_type>(kSpec, row_);
        return res && res != StringPool::Id::Null() ? StringPool::Id{*res} : StringPool::Id::Null();
      }
        std::optional<int64_t> processing_order() const {
      PERFETTO_DCHECK(!table_->dataframe_.finalized());
      return table_->dataframe_.template GetCellUnchecked<ColumnIndex::processing_order>(kSpec, row_);
    }

    private:
      const TraceFileTable* table_;
      uint32_t row_ = 0;
  };
  struct IdAndRow {
    Id id;
    RowNumber row_number;
    uint32_t row;
    RowReference row_reference;
  };
  
  struct Row {
    Row(std::optional<TraceFileTable::Id> _parent_id = {}, std::optional<StringPool::Id> _name = {}, int64_t _size = {}, StringPool::Id _trace_type = {}, std::optional<int64_t> _processing_order = {}) : parent_id(std::move(_parent_id)), name(std::move(_name)), size(std::move(_size)), trace_type(std::move(_trace_type)), processing_order(std::move(_processing_order)) {}

    bool operator==(const Row& other) const {
      return std::tie(parent_id, name, size, trace_type, processing_order) ==
             std::tie(other.parent_id, other.name, other.size, other.trace_type, other.processing_order);
    }

        std::optional<TraceFileTable::Id> parent_id;
    std::optional<StringPool::Id> name;
    int64_t size;
    StringPool::Id trace_type;
    std::optional<int64_t> processing_order;
  };

  explicit TraceFileTable(StringPool* pool)
      : dataframe_(dataframe::Dataframe::CreateFromTypedSpec(kSpec, pool)) {}

  IdAndRow Insert(const Row& row) {
    uint32_t row_count = dataframe_.row_count();
    dataframe_.InsertUnchecked(kSpec, std::monostate(), row.parent_id ? std::make_optional(row.parent_id->value) : std::nullopt, row.name && row.name != StringPool::Id::Null() ? std::make_optional(*row.name) : std::nullopt, row.size, row.trace_type != StringPool::Id::Null() ? std::make_optional(row.trace_type) : std::nullopt, row.processing_order);
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
    return "__intrinsic_trace_file";
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

#endif  // SRC_TRACE_PROCESSOR_TABLES_METADATA_TABLES_PY_H_
